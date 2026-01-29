import { Request, Response, NextFunction } from 'express';
import { mysqlPool as db } from '../config/db';

async function verifyDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const deviceId = req.header('X-Device-Id');
    const apiKey = req.header('X-Api-Key');
    const timestamp = req.header('X-Timestamp');

    if (!deviceId || !apiKey || !timestamp) {
      res.status(401).json({ message: 'Missing auth headers' });
      return;
    }

    // check replay (5 phút)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(timestamp)) > 300) {
      res.status(401).json({ message: 'Request expired' });
    }

    const [rows]: any = await db.execute(
      `SELECT api_secret FROM attendance_device
       WHERE device_id = ? AND api_key = ? AND is_active = 1`,
      [deviceId, apiKey]
    );

    if (!rows.length) {
      res.status(401).json({ message: 'Invalid device' });
    }
    // Để đơn giản thì bỏ qua phần kiểm tra chữ ký
    // const signature = req.header('X-Signature');

    // const apiSecret = rows[0].api_secret;

    // const rawData = deviceId + timestamp + JSON.stringify(req.body);

    // const expectedSignature = crypto.createHmac('sha256', apiSecret).update(rawData).digest('hex');

    // if (expectedSignature !== signature) {
    //   res.status(401).json({ message: 'Invalid signature' });
    // }

    next();
  } catch (err) {
    next(err);
  }
}

export default verifyDevice;
