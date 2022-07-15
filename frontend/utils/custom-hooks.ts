import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Uid } from "./uid-generator";

export const useWalletConnection = () => {
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

export const useNftRecordModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingNftRecord, setIsLoadingNftRecord] = useState(false);
  const [uid, setUid] = useState<Uid | null>(null);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinishLoadingNftRecord = () => {
    setIsLoadingNftRecord(false);
  };

  const launchModalWithUid = (uid: Uid) => {
    launchModalForProgress();
    setUid(uid);
  };

  const launchModalForProgress = () => {
    setUid(null);
    setIsLoadingNftRecord(true);
    setIsModalVisible(true);
  };

  const dismissModal = () => {
    setIsLoadingNftRecord(false);
    setIsModalVisible(false);
    setUid(null);
  };

  return {
    uid,
    isModalVisible,
    isLoadingNftRecord,
    handleOk,
    handleCancel,
    handleFinishLoadingNftRecord,
    launchModalWithUid,
    launchModalForProgress,
    dismissModal,
  };
};
