import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

type Props = {
  handleUsernameSubmit: (username: string) => void;
}

const RoomInput = ({handleUsernameSubmit}: Props) => {
  const [username, setUsername] = React.useState("");

  const onUsernameSubmit = () => {
    handleUsernameSubmit(username);
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={onUsernameSubmit}>Submit Username</Button>
    </div>
  );
};

export default RoomInput;