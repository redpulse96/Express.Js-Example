const driversModel = require('./model');
const haversineDistance = require('./haversine');
/**
 * Stores a new product into the database.
 * @param {Object} product product object to create.
 * @throws {Error} If the product is not provided.
 */
module.exports = {
  async create(driver) {
    try {
      if (!driver)
        return {
          success: false,
          message: 'Invalid request'
        }

      const driverInstance = {
        ...driver,
        id: Date.now()
      };
      const driverRes = await driversModel.create(driverInstance);
      if (driverRes) {
        return {
          success: true,
          data: {
            id: driverRes.id,
            name: driverRes.name,
            email: driverRes.email,
            phone_number: driverRes.phone_number,
            license_number: driverRes.license_number,
            car_number: driverRes.car_number,
          }
        }
      }
      return false
    } catch (error) {
      console.log('error')
      console.error(error)
      return {
        success: false,
        message: error.message
      }
    }
  },

  async sendLocation(data) {
    try {
      const {
        latitude,
        longitude
      } = data;
      const driverDetails = await driversModel.findOne({
        id: data.id
      });
      if (driverDetails) {
        driverDetails.latitude = latitude;
        driverDetails.longitude = longitude;
        await driverDetails.save();
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: 'Driver with id does not exist'
        };
      }
    } catch (error) {
      console.log('catch.error');
      console.error(error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  async getNearbyDrivers(data) {
    try {
      const {
        latitude,
        longitude
      } = data;
      const available_cabs = [];
      const driversList = await driversModel.find();
      if (driversList && driversList.length) {
        driversList.map(val => {
          if (val.latitude && val.longitude) {
            const sourceObj = {
              latitude,
              longitude
            };
            const cabObj = {
              latitude: val.latitude,
              longitude: val.longitude
            };
            haversineDistanceInMeteres = haversineDistance(cabObj, sourceObj);
            if (haversineDistanceInMeteres <= 4000) {
              available_cabs.push({
                name: val.name,
                car_number: val.car_number,
                phone_number: val.phone_number
              });
            }
          }
        });
        if (available_cabs.length) {
          return {
            available_cabs
          };
        } else {
          return {
            message: 'No cabs available!'
          };
        }
      }
      return {
        message: 'No cabs available!'
      };
    } catch (error) {
      console.log('catch.error');
      console.error(error);
      return {
        message: 'No cabs available!'
      };
    }
  }
}