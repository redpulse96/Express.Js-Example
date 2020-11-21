const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/Defcon_One_Auth?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
    console.log('Mongodb connection established');
  })
  .catch(err => console.error(err));