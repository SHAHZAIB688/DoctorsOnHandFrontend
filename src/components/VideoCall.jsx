import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { getSocketBaseUrl } from "../utils/getSocketBaseUrl";

function buildPeerOptions() {
  const host = import.meta.env.VITE_PEER_HOST;
  if (!host) return { debug: 1 };
  return {
    debug: 1,
    host,
    port: Number(import.meta.env.VITE_PEER_PORT) || 443,
    path: import.meta.env.VITE_PEER_PATH || "/",
    secure: import.meta.env.VITE_PEER_SECURE !== "false",
  };
}

/**
 * PeerJS + Socket.io WebRTC call. Doctor dials; patient answers.
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {string} roomId - e.g. appointment id (shared by both users)
 * @param {'doctor'|'patient'} role
 */
export default function VideoCall({ open, onClose, roomId, role }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const activeCallRef = useRef(null);
  const pendingRemotePeerRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const cleanup = useCallback(() => {
    pendingRemotePeerRef.current = null;
    if (activeCallRef.current) {
      try {
        activeCallRef.current.close();
      } catch {
        /* ignore */
      }
      activeCallRef.current = null;
    }
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch {
        /* ignore */
      }
      peerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (!open) {
      cleanup();
      setPhase("idle");
      setError("");
      setStatus("");
    }
  }, [open, cleanup]);

  const wireRemoteStream = useCallback((remoteStream) => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, []);

  const attachCallHandlers = useCallback(
    (call) => {
      call.on("stream", (remoteStream) => {
        wireRemoteStream(remoteStream);
        setPhase("live");
        setStatus("Connected");
      });
      call.on("close", () => {
        setStatus("Call ended");
        setPhase("ended");
      });
      call.on("error", (err) => {
        console.error(err);
        setError(err?.message || "Call error");
      });
    },
    [wireRemoteStream]
  );

  const doctorStartCall = useCallback(
    (remotePeerId) => {
      const peer = peerRef.current;
      const stream = localStreamRef.current;
      if (!peer || !stream || !remotePeerId) return;
      if (activeCallRef.current) {
        try {
          activeCallRef.current.close();
        } catch {
          /* ignore */
        }
        activeCallRef.current = null;
      }
      try {
        const call = peer.call(remotePeerId, stream);
        activeCallRef.current = call;
        attachCallHandlers(call);
        setStatus("Calling…");
      } catch (e) {
        setError(e?.message || "Could not start call");
      }
    },
    [attachCallHandlers]
  );

  const joinSession = async () => {
    if (!roomId) return;
    setError("");
    setStatus("Requesting camera and microphone…");
    setPhase("joining");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      const base = getSocketBaseUrl();
      const socket = io(base, { transports: ["websocket", "polling"] });
      socketRef.current = socket;

      socket.on("user-connected", ({ role: otherRole }) => {
        setStatus(`Partner connected (${otherRole})`);
      });
      socket.on("user-disconnected", () => {
        setStatus("Partner left");
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        setPhase((p) => (p === "live" ? "ended" : p));
      });

      socket.emit("join-video-room", { roomId: String(roomId), role });

      if (role === "doctor") {
        socket.on("signal-start-call", ({ remotePeerId }) => {
          if (!peerRef.current?.id) {
            pendingRemotePeerRef.current = remotePeerId;
            return;
          }
          doctorStartCall(remotePeerId);
        });
      }

      const peer = new Peer(undefined, buildPeerOptions());
      peerRef.current = peer;

      peer.on("open", (id) => {
        setStatus(`Signaling… (${id.slice(0, 8)}…)`);
        socket.emit("register-peer", { roomId: String(roomId), role, peerId: id });
        if (role === "doctor" && pendingRemotePeerRef.current) {
          doctorStartCall(pendingRemotePeerRef.current);
          pendingRemotePeerRef.current = null;
        }
      });

      peer.on("call", (call) => {
        const s = localStreamRef.current;
        if (s) call.answer(s);
        activeCallRef.current = call;
        attachCallHandlers(call);
        setStatus("Answering…");
      });

      peer.on("error", (err) => {
        console.error(err);
        setError(err?.message || "Peer error");
        setPhase("error");
      });

      peer.on("disconnected", () => {
        setStatus("Peer disconnected");
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Could not access camera or microphone");
      setPhase("error");
      cleanup();
    }
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 text-slate-100">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Video call (WebRTC)</p>
          <p className="truncate text-[10px] text-slate-500">
            Room: {String(roomId).slice(0, 12)}… · You: {role}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 rounded bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-600"
        >
          Close
        </button>
      </header>

      <div className="grid min-h-0 flex-1 gap-2 p-2 md:grid-cols-2">
        <div className="relative min-h-[140px] overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-800">
          <p className="absolute left-2 top-2 z-10 rounded bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase">
            You (muted)
          </p>
          <video ref={localVideoRef} className="h-full w-full object-cover" playsInline autoPlay muted />
        </div>
        <div className="relative min-h-[140px] overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-800">
          <p className="absolute left-2 top-2 z-10 rounded bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase">
            Partner
          </p>
          <video ref={remoteVideoRef} className="h-full w-full object-cover" playsInline autoPlay />
        </div>
      </div>

      <footer className="shrink-0 border-t border-slate-800 bg-slate-900 px-3 py-3">
        {error ? <p className="mb-2 text-center text-xs text-rose-400">{error}</p> : null}
        {status ? <p className="mb-2 text-center text-xs text-slate-400">{status}</p> : null}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {phase === "idle" || phase === "error" || phase === "ended" ? (
            <button
              type="button"
              onClick={joinSession}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Join call
            </button>
          ) : phase === "joining" ? (
            <p className="text-sm text-slate-400">Connecting…</p>
          ) : null}
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-600">
          Uses PeerJS (free broker) and your backend for signaling. Both users must allow camera and mic.
        </p>
      </footer>
    </div>
  );
}
