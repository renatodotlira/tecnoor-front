const dotenv = require('dotenv');
import * as webpack from 'webpack';

dotenv.config();

export default {
  plugins: [
    new webpack.DefinePlugin({
      APPOINTMENT_URL: JSON.stringify(process.env['APPOINTMENT_URL']),
      EMPLOYEE_URL: JSON.stringify(process.env['EMPLOYEE_URL'])
    }),
  ],
};