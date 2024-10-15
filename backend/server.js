  const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const { createUser, findUserByUsername } = require('./fireStore');
const app = express();
const PORT = 8080;
const cors = require('cors');


const authRouter = require('./routers/authRouter');
const driverRouter = require('./routers/driverRouter');
const packageRouter = require('./routers/packageRouter');
const statsRouter = require('./routers/statsRouter');

// app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// app.use(express.static(path.join(__dirname, 'public')));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

//10.192.0.4 mongodb VM
// mongoose.connect('mongodb://localhost:27017/FIT2095-A2', {
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
// });

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../CloudService.json'); //removed for security reasons

const authMiddleware = require('./middleware/authMiddleware');
const http = require('http');
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const socketIo = require('socket.io');
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini_api_key = "";//removed for security reasons

const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server)//, {
  // cors: {
  //   origin: "http://localhost:4200", 
  //   methods: ["GET", "POST"]
  // }
//});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./dist/a3app/browser"));


app.use('/public', express.static(path.join(__dirname, 'public')));
io.on('connection', (socket) => {
  console.log('New client connected');

  // Text-to-Speech
  socket.on('textToSpeech', async (data) => {
    console.log('Received textToSpeech event:', data);
    const { text } = data;
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    try {
      const [response] = await client.synthesizeSpeech(request);
      const filePath = path.join(__dirname, 'public', 'output.mp3');
      fs.writeFileSync(filePath, response.audioContent, 'binary');
      console.log('Audio file created:', filePath);
      socket.emit('audioReady', { filePath: '/public/output.mp3' });
    } catch (err) {
      console.error('ERROR:', err);
      socket.emit('audioError', { error: err.message });
    }
  });

  // Translation
  socket.on('translateText', async (data) => {
    console.log('Received translateText event:', data);
    try {
      const [translation] = await translate.translate(data.text, data.targetLanguage);
      console.log('Translation completed:', translation);
      socket.emit('translationReady', { translatedText: translation });
    } catch (err) {
      console.error('Error translating text:', err);
      socket.emit('translationError', { error: err.message });
    }
  });

  // AI
  socket.on('calculateDistance', async (data) => {
    try {
      const result = await geminiModel.generateContent(`What is the distance from ${data.destination} to Melbourne in kilometers?`);
  
      if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
        const candidate = result.response.candidates[0];
        let distance;
  
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          distance = candidate.content.parts[0].text.trim();
        } else {
          distance = 'Unknown distance';
        }
  
        console.log('Distance calculated:', distance);
        socket.emit('distanceCalculated', { packageId: data.packageId, distance });
      } else {
        throw new Error('Invalid response from Generative AI API');
      }
    } catch (error) {
      console.error('Distance Calculation Error:', error);
      socket.emit('distanceCalculationError', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


async function connect() {
    await mongoose.connect('mongodb://localhost:27017/FIT2095-A3');
}


app.use('/api/v1/drivers' , driverRouter);
app.use('/api/v1/packages' , packageRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/auth',authRouter)

connect();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


// app.use('/33934479/HongSze/api/v1/user', authRouter);
// app.use('/33934479/HongSze/api/v1/drivers', apiAuthMiddleware, driverRouter);
// app.use('/33934479/HongSze/api/v1/packages', apiAuthMiddleware, packageRouter);
// app.use('/33934479/HongSze/drivers', authMiddleware);
// app.use('/33934479/HongSze/packages', authMiddleware);
// app.use('/33934479/HongSze/stats', authMiddleware);
// app.use('/33934479/HongSze/stats', statsRouter);

/**
 * Starts the server.
 * @name listen
 * @param {number} PORT - The port number on which the server listens.
 * @param {function} callback - The callback function to execute after the server starts.
 */
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
// }));

// /**
//  * Middleware to check if the user is authenticated.
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  */
// function authMiddleware(req, res, next) {
//     if (!req.session || !req.session.user) {
//         return res.redirect('/33934479/HongSze/user/login');
//     }
//     next();
// }

// /**
//  * Middleware to check if the user is authenticated for API routes.
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  */
// function apiAuthMiddleware(req, res, next) {
//     if (!req.session || !req.session.user) {
//         return res.status(401).json({ error: 'Please login first.' });
//     }
//     next();
// }

// /**
//  * Route to serve the login page.
//  * @name GET/33934479/HongSze/user/login
//  * @function
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// app.get('/33934479/HongSze/user/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'login.html'));
// });

// /**
//  * Route to serve the signup page.
//  * @name GET/33934479/HongSze/user/signup
//  * @function
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// app.get('/33934479/HongSze/user/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'signUp.html'));
// });

// /**
//  * Route to handle user signup.
//  * @name POST/33934479/HongSze/user/signup
//  * @function
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// app.post('/33934479/HongSze/user/signup', async (req, res) => {
//     const { username, password, passwordConfirm } = req.body;
//     if (password !== passwordConfirm) {
//       console.error('Password and confirmation do not match');
//       return res.redirect('/33934479/HongSze/invalidData');
//     }
  
//     try {
//       await createUser(username, password);
//       res.redirect('/33934479/HongSze/user/login');
//     } catch (error) {
//       console.error('Error during signup:', error);
//       res.redirect('/33934479/HongSze/invalidData');
//     }
//   });

// /**
//  * Route to handle user login.
//  * @name POST/33934479/HongSze/user/login
//  * @function
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// app.post('/33934479/HongSze/user/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//       const user = await findUserByUsername(username);
  
//       if (user && user.password === password) {
//         req.session.user = user;
//         res.redirect('/');
//       } else {
//         console.error('Invalid username or password');
//         res.redirect('/33934479/HongSze/invalidData');
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.redirect('/33934479/HongSze/invalidData');
//     }
//   });

// // app.use('/33934479/HongSze/api/v1/user', authRouter);
// // app.use('/33934479/HongSze/api/v1/drivers', apiAuthMiddleware, driverRouter);
// // app.use('/33934479/HongSze/api/v1/packages', apiAuthMiddleware, packageRouter);
// // app.use('/33934479/HongSze/drivers', authMiddleware);
// // app.use('/33934479/HongSze/packages', authMiddleware);
// // app.use('/33934479/HongSze/stats', authMiddleware);
// // app.use('/33934479/HongSze/stats', statsRouter);

// /**
//  * Route to display the Add Driver form.
//  * @name getAddDriver
//  * @route {GET} /33934479/HongSze/drivers/addDriver
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/drivers/addDriver', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'addDriver.html'));
// });

// /**
//  * Route to handle the Add Driver form submission.
//  * @name postAddDriver
//  * @route {POST} /33934479/HongSze/drivers/addDriver
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.post('/33934479/HongSze/drivers/addDriver', async (req, res) => {
//     const { driver_name, driver_department, driver_licence, driver_isActive } = req.body;
//     const newDriver = new Driver({
//         driver_name,
//         driver_department,
//         driver_licence,
//         driver_isActive: driver_isActive === 'true'
//     });

//     try {
//         await newDriver.save();
//         res.redirect('/33934479/HongSze/drivers');
//     } catch (error) {
//         res.redirect('/33934479/HongSze/invalidData');
//     }
// });

// /**
//  * Route to list all drivers.
//  * @name getListDrivers
//  * @route {GET} /33934479/HongSze/drivers
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/drivers', async (req, res) => {
//     try {
//         const drivers = await Driver.find();

//         // Check if it's a JSON request or an HTML request
//         if (req.headers['accept'].includes('application/json')) {
//             // If API request, return JSON
//             res.status(200).json(drivers);
//         } else {
//             // Otherwise, return the HTML view
//             res.render('listDrivers', { drivers });
//         }
//     } catch (error) {
//         if (req.headers['accept'].includes('application/json')) {
//             // For API requests, send JSON errors
//             res.status(500).json({ error: 'Server error: ' + error.message });
//         } else {
//             // For HTML requests, send a rendered error page or message
//             res.status(500).send('Server error, please try again later.');
//         }
//     }
// }); 

// app.get('/33934479/HongSze/drivers/deleteDriver', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'deleteDriver.html'));
// });

// /**
//  * Route to delete a driver by ID.
//  * @name getDeleteDriver
//  * @route {GET} /33934479/HongSze/drivers/deleteDriver
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.post('/33934479/HongSze/drivers/deleteDriver', async (req, res) => {
//     const { driver_id } = req.body;

//     try {
//         const driver = await Driver.findOneAndDelete({ driver_id });
//         if (!driver) {
//             throw new Error('Driver not found');
//         }

//         await Package.deleteMany({ _id: { $in: driver.assigned_packages } });

//         res.redirect('/33934479/HongSze/drivers');
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/33934479/HongSze/drivers/deleteDriverByDepartment', async (req, res) => {
//     const { driver_id, department } = req.body; // Include department in the request

//     try {
//         const driver = await Driver.findOneAndDelete({ driver_id });
//         if (!driver) {
//             throw new Error('Driver not found');
//         }

//         // If the driver is found, delete all the packages assigned to the driver
//         await Package.deleteMany({ _id: { $in: driver.assigned_packages } });

//         // Redirect back to the filtered list of drivers by department
//         res.redirect(`/33934479/HongSze/drivers/department?department=${department}`);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// /**
//  * Route to display the Add Package form.
//  * @name getAddPackage
//  * @route {GET} /33934479/HongSze/packages/addPackage
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/packages/addPackage', async (req, res) => {
//     try {
//         const drivers = await Driver.find({});
//         res.render('addPackage', { drivers });
//     } catch (error) {
//         res.redirect('/33934479/HongSze/invalidData');
//     }
// });

// /**
//  * Route to handle the Add Package form submission.
//  * @name postAddPackage
//  * @route {POST} /33934479/HongSze/packages/addPackage
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.post('/33934479/HongSze/packages/addPackage', async (req, res) => {
//     try {
//         let newPackageDetails = req.body;
//         newPackageDetails.isAllocated = newPackageDetails.isAllocated === 'on';

//         if (newPackageDetails.package_description.length > 30) {
//             return res.redirect('/33934479/HongSze/invalidData');
//         }

//         let driver = await Driver.findById(newPackageDetails.driver_id);
//         if (!driver) {
//             return res.redirect('/33934479/HongSze/invalidData');
//         }

//         let pkg = new Package(newPackageDetails);
//         await pkg.save();

//         driver.assigned_packages.push(pkg._id);
//         await driver.save();
//         res.redirect('/33934479/HongSze/packages');
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             res.redirect('/33934479/HongSze/invalidData');
//         } else {
//             res.status(500).json({ error: error.message });
//         }
//     }
// });

// /**
//  * Route to list all packages.
//  * @name getListPackages
//  * @route {GET} /33934479/HongSze/packages
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/packages', async (req, res) => {
//     try {
//         const packages = await Package.find({}).populate('driver_id');

//         if (req.headers.accept && req.headers.accept.includes('application/json')) {
//             res.json(packages);
//         } else {
//             res.render('listPackages', { packages });
//         }
//     } catch (error) {
//         res.redirect('/33934479/HongSze/invalidData');
//     }
// }); 

// app.get('/33934479/HongSze/packages/deletePackage', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'deletePackage.html'));
// });

// /**
//  * Route to delete a package by ID.
//  * @name getDeletePackage
//  * @route {GET} /33934479/HongSze/packages/deletePackage
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.post('/33934479/HongSze/packages/deletePackage', async (req, res) => {
//     const { package_id } = req.body;

//     try {
//         const pkg = await Package.findOneAndDelete({ package_id });
//         if (!pkg) {
//             throw new Error('Package not found');
//         }

//         const driver = await Driver.findById(pkg.driver_id);
//         if (driver) {
//             driver.assigned_packages.pull(pkg._id);
//             await driver.save();
//         }

//         res.redirect('/33934479/HongSze/packages');
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /**
//  * Route to display the form for selecting a department.
//  * @name getDepartmentDrivers
//  * @route {GET} /33934479/HongSze/drivers/department
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/drivers/department', async (req, res) => {
//     const department = req.query.department;

//     if (department) {
//         try {
//             const filteredDrivers = await Driver.find({ driver_department: { $regex: new RegExp(department, 'i') } });
//             res.render('listDriversByDepartment', { drivers: filteredDrivers, selectedDepartment: department });
//         } catch (error) {
//             res.redirect('/33934479/HongSze/invalidData');
//         }
//     } else {
//         res.render('selectDepartment');
//     }
// });

// /**
//  * Home route.
//  * @name getHome
//  * @route {GET} /
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/', async (req, res) => {
//     const driverCount = await Driver.countDocuments();
//     const packageCount = await Package.countDocuments();
//     res.render('index', { driverCount, packageCount });
// });

// /**
//  * Invalid Data Route.
//  * @name getInvalidData
//  * @route {GET} /33934479/HongSze/invalidData
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.get('/33934479/HongSze/invalidData', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'invalidData.html'));
// });

// /**
//  * 404 route.
//  * @name get404
//  * @route {GET} *
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  */
// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

