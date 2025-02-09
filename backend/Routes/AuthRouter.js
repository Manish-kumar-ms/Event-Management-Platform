import express from 'express';

import { login, signup } from '../Controller/Auth.js';
import { deleteEvent, eventcreate, getallEvent, getmyevent, joinEvent, leaveEvent } from '../Controller/EventCreate.js';
import { ensureAuthentication } from '../Middlewares/Authentication.js';
const router =express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/createevent",ensureAuthentication,eventcreate)
router.get("/getallEvent",ensureAuthentication,getallEvent)
router.get("/getmyEvent",ensureAuthentication,getmyevent)
router.delete("/deletemyEvent/:eventId",ensureAuthentication,deleteEvent)

router.post("/joinEvent/:eventId", ensureAuthentication, joinEvent);
router.post("/leaveEvent/:eventId", ensureAuthentication, leaveEvent);

export default router