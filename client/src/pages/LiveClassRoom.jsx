import { useParams } from "react-router-dom";

function LiveClassRoom() {
  const { roomId } = useParams();

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <iframe
        src={`https://meet.jit.si/${roomId}`}
        title="Live Class"
        width="100%"
        height="100%"
        allow="camera; microphone; fullscreen"
      />
    </div>
  );
}

export default LiveClassRoom;