import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useWalletConnection = () => {
  const { isConnected } = useAccount();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [isConnected]);

  return isWalletConnected;
};

export default useWalletConnection;
