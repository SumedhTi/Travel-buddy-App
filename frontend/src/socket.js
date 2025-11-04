// socket.js
import { io } from "socket.io-client";
import { socketBase } from "../api";

const socket = io(socketBase);

export default socket;
