'use client'

import CreateServerModal from "@/components/modals/create-server-modal"
import { useEffect, useState } from "react";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import ManageMember from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveModal from "../modals/leave-server-modal";
import DeleteModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/message-file-modal";
import DeleteMessageModal from "../modals/delete-message-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() =>{
      setIsMounted(true)
    }, [])

    if (!isMounted) {
      return null
    }


    return ( 
        <>
          <CreateServerModal />
          <InviteModal />
          <EditServerModal />
          <ManageMember />
          <CreateChannelModal />
          <LeaveModal />
          <DeleteModal />
          <DeleteChannelModal />
          <EditChannelModal />
          <MessageFileModal />
          <DeleteMessageModal />
        </>
     );
}
 
export default ModalProvider;