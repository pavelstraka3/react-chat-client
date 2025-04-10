import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

type Props = {
  handleRoomSubmit: (username: string) => void;
};

const UserInput = ({ handleRoomSubmit }: Props) => {
  const [room, setRoom] = React.useState("");

  const onRoomSubmit = () => {
    handleRoomSubmit(room);
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <Button onClick={onRoomSubmit}>Join Room</Button>
    </div>
  );
};

export default UserInput;
