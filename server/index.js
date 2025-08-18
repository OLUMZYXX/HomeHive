import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import AuthService from './authService/authService.js'
import JWTAuthService from './jwtAuthService/jwtAuthService.js'
import {
  propertyService,
  userService,
  hostService,
  bookingService,
} from './homeHiveService/homeHiveService.js'


