var express = require('express');
var router = express.Router();
const {
  create,
  sendLocation,
  getNearbyDrivers
} = require('../src/driver/controller');

router.post('/driver/register/', async function (req, res, next) {
  const {
    body
  } = req;
  const {
    name,
    email,
    phone_number,
    license_number,
    car_number
  } = body
  const finalResponseObj = {
    status: 'failure',
    reason: 'explanation'
  }
  const registerDriverObj = {}
  console.log('phone_number', /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g.test(phone_number))
  if (phone_number && /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g.test(phone_number)) {
    registerDriverObj.phone_number = phone_number.toString();
  } else {
    finalResponseObj.reason = `${phone_number ? 'invalid phone number format' : 'phone number should be provided'}`;
  }
  if (name) {
    registerDriverObj.name = name;
  } else {
    finalResponseObj.reason = 'name should be provided';
  }
  if (email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
    registerDriverObj.email = email;
  } else {
    finalResponseObj.reason = `${email ? 'invalid email format' : 'email should be provided'}`;
  }
  if (license_number) {
    registerDriverObj.license_number = license_number;
  } else {
    finalResponseObj.reason = 'license number should be provided';
  }
  if (car_number) {
    registerDriverObj.car_number = car_number;
  } else {
    finalResponseObj.reason = 'car number should be provided';
  }
  const registerDriver = await create(registerDriverObj);
  if (registerDriver.success) {
    res.status(201);
    return res.send(registerDriver.data);
  } else if (!registerDriver.success && finalResponseObj) {
    finalResponseObj.reason = registerDriver.message || finalResponseObj.reason;
    res.status(400);
    return res.send(finalResponseObj);
  } else {
    finalResponseObj.reason = registerDriver.message || finalResponseObj.reason;
    res.status(500);
    return res.send(finalResponseObj);
  }
});

router.post('/driver/:id/sendLocation/', async function (req, res, next) {
  const {
    body,
    params
  } = req;
  const finalResponse = {
    status: 'failure'
  };
  if (!params.id) {
    finalResponse.reason = 'driver id was not provided';
    res.status(400);
    return res.send(finalResponse);
  } else if (!body.latitude) {
    finalResponse.reason = 'latitude was not provided';
    res.status(400);
    return res.send(finalResponse);
  } else if (!body.longitude) {
    finalResponse.reason = 'longitude was not provided';
    res.status(400);
    return res.send(finalResponse);
  }
  const {
    latitude,
    longitude
  } = body;
  const {
    id
  } = params;
  const saveLocation = await sendLocation({
    id,
    longitude,
    latitude
  });
  if (saveLocation.success) {
    res.status(202);
    return res.send({
      status: 'success'
    });
  } else {
    res.status(500);
    return res.send({
      status: 'failure',
      reason: saveLocation.message
    });
  }
});
router.post('/passenger/available_cabs/', async function (req, res, next) {
  const {
    body
  } = req;
  const finalResponse = {
    status: 'failure'
  };
  if (!body.latitude) {
    finalResponse.reason = 'latitude was not provided'
    res.status(400)
    return res.send(finalResponse);
  } else if (!body.longitude) {
    finalResponse.reason = 'latitude was not provided'
    res.status(400)
    return res.send(finalResponse);
  }

  const {
    latitude,
    longitude
  } = body;
  const availableCars = await getNearbyDrivers({
    latitude,
    longitude
  });
  res.status(200);
  return res.send(availableCars);
});

module.exports = router;