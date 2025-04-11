import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtContent = {
  email: string;
  exp: number;
};

const useJWT = (token: string) => {
  const [email, setEmail] = useState<string>();
  const [tokenExp, setTokenExp] = useState<Date>();

  useEffect(() => {
    const decoded = jwtDecode(token) as JwtContent;

    if (decoded.email) {
      setEmail(decoded.email);
    }

    if (decoded.exp) {
      setTokenExp(new Date(decoded.exp));
    }
  }, [token]);

  return { email, tokenExp };
};

export default useJWT;
