const express = require("express");
const { body, validationResult } = require("express-validator");

const medicineRouter = express.Router();

const Medicine = require("../models/add.js");


//add medicine
medicineRouter.get('/dashboard', async (req, res) => {
  try {
    // Assuming you fetch the medicines from the database
    const allMedicine = await Medicine.find();

    res.render("Dashboard", { allMedicine });
  } catch (err) {
    console.error(err);
    res.status(500).render("Dashboard", { errorMessage: "Internal Server Error" });
  }
});


medicineRouter.get('/add-medicine',(req,res)=>{
  res.render('home')
})
medicineRouter.post("/add-medicine", [
  body("medicineName")
    .trim()
    .notEmpty()
    .withMessage("Medicine name is required"),
  body("medicinePrice")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price should be a number")
    .custom((value, { req }) => {
      if (value < 1) {
        throw new Error("Please enter a valid price");
      }
      return true;
    }),
  body("medicineCategory").notEmpty().withMessage("Category is required"),
  body("medicineAmount").notEmpty().withMessage("Please enter the correct amount"),
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("home", { errors: errors.array() });
    }

    const { medicineName, medicinePrice, medicineCategory, medicineAmount } = req.body;

    const medicineFound = await Medicine.findOne({
      medicineName: { $regex: new RegExp("^" + medicineName + "$", "i") },
    });

    if (medicineFound) {
      return res.render("home", { errorMessage: "Medicine already exists." });
    }

    const newMedicine = new Medicine({
      medicineName,
      medicinePrice,
      medicineCategory,
      medicineAmount,
    });
    await newMedicine.save();
    req.session.successMessage = "Medicine added successfully";
    res.redirect("/medicine/dashboard");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).render("home", { errorMessage: "Internal Server Error" });
  }
});


medicineRouter.get('/delete-medicine/:id', async (req, res) => {
  try {
    const medicineId = req.params.id;

    // Assuming you have a method to delete a medicine by its ID in your model
    await Medicine.findByIdAndDelete(medicineId);

    // Redirect to the dashboard with a success message
    req.session.successMessage = "Medicine deleted successfully";
    res.redirect("/medicine/dashboard");
  } catch (err) {
    console.error(err);
    // Redirect to the dashboard with an error message
    req.session.errorMessage = "Error deleting medicine";
    res.redirect("/medicine/dashboard");
  }
});

medicineRouter.get('/edit-medicine/:id', async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).render("Dashboard", { errorMessage: "Medicine not found" });
    }

    res.render("EditMedicine", { medicine });
  } catch (err) {
    console.error(err);
    res.status(500).render("Dashboard", { errorMessage: "Internal Server Error" });
  }
});

medicineRouter.post('/edit-medicine/:id', async (req, res) => {
  const {medicineName,  medicinePrice,  medicineCategory, medicineAmount }=req.body
  try {
    const medicineToUpdate= await Medicine.findById( req.params.id);
    

     await Medicine.findByIdAndUpdate(
      medicineToUpdate,
      { medicineName, medicinePrice, medicineCategory, medicineAmount },
      { new: true }
    );

    req.session.successMessage = "Medicine updated successfully";
    res.redirect("/medicine/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).render("Dashboard", { errorMessage: "Internal Server Error" });
  }
});



// search
medicineRouter.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.search;

    const searchResults = await Medicine.find({     
      medicineName: { $regex: searchTerm, $options: "i" } ,      
    });

    res.render("Searchresults", { medicines: searchResults });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
  
});

module.exports = medicineRouter;
