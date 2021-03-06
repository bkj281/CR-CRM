const express = require('express'),
      app = express(),
      company = require('../models/company'),
      employee = require('../models/employee'),
      customer = require('../models/customer'),
      message = require('../models/message');




app.post('/comp', async (req, res) => {
    try {
        if (await company.countDocuments() === 0) {
            req.body.compID = 1;
        }
        else {
            const id = await company.findOne({}).sort({compID: -1});
            req.body.compID = id.compID + 1;
        }
        const comp = new company(req.body);
        await comp.save();
        res.send(comp);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get('/comps', async (req, res) => {
    try {    
        const users = await company.find({});
        res.status(200).send(users);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.post('/emp', async (req, res) => {
    try {
        const emp = new employee(req.body);
        await emp.save();
        res.send(emp);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get('/emps', async (req, res) => {
    try {    
        const users = await employee.find({});
        res.status(200).send(users);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.post('/comp-auth', async (req, res) => {
    try {
        const comp = await employee.findOne(req.body);
        // console.log(comp);
        if (comp === null)
            res.status(404).send(false);
        else
            res.status(200).send(comp);
    }
    catch (err) {
        res.status(500).send(err);
    }

})

app.post('/data-retrieve', async (req, res) => {
    try {
        const comp = await company.findOne(req.body);
        // console.log(comp);
        if (comp === null)
            res.status(404).send(false);
        else
            res.status(200).send(comp);
    }
    catch (err) {
        res.status(500).send(err);
    }

})

app.post('/addCust', async (req, res) => {
    try {
        if (await customer.countDocuments() === 0) {
            req.body.custID = 1;
        }
        else {
            const id = await customer.findOne({}).sort({custID: -1});
            req.body.custID = id.custID + 1;
        }
        const cust = new customer(req.body);
        await cust.save();
        res.send(cust);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get('/profile/:compID', async (req, res) => {
    try {    
        // console.log(req.params);
        const users = await customer.find({compID: req.params.compID}).limit(7);
        res.status(200).send(users);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.delete('/profile/:compID', async (req, res) => {
    try {
        const user = await company.deleteOne({compID: req.params.compID});
        if (!user) res.status(404).send('No user found');

        user = await employee.deleteMany({compID: req.params.compID});
        if (!user) res.status(404).send('No user found');
        
        user = await customer.deleteMany({compID: req.params.compID});
        // if (!user) res.status(404).send('No user found');
        
        user = await message.deleteMany({compId: req.params.compID});
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(303).send(err);
    }
})

app.delete('/profile/:compID/delCust/:custID', async (req, res) => {
    try {
        const cust = await customer.deleteOne({custID: req.params.custID});
        if (!cust) res.status(404).send('Customer already Deleted');

        cust = await message.deleteMany({custId: req.params.custID});

        res.status(200).send();
    }
    catch(err) {
        console.log(err);
        res.status(303).send(err);
    }
})

app.post('/profile/:compID/sendMsg', async (req, res) => {
    try {
        // console.log(req.body);
        const msg = new message(req.body);
        // console.log(msg);
        await msg.save();
        res.status(200).send(msg);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.put('/profile/:_id/updateCompany', async (req, res) => {
	try {
		// console.log(req.params._id);
		const comp = await company.findByIdAndUpdate(req.params._id, req.body);
		await comp.save();
		res.status(200).send(comp);
	}
	catch(err) {
		console.log(err);
		res.status(303).send(err);
	}
})

app.put('/profile/:compID/delCust/:_id', async (req, res) => {
	try {
		const cust = await customer.findByIdAndUpdate(req.params._id, req.body);
		await cust.save();
		res.status(200).send(cust);
	}
	catch(err) {
		console.log(err);
		res.status(303).send(err);
	}
})

app.get('/messages/:custID', async (req, res) => {
	try {
		// console.log(req.params.custID);
		const msg = await message.find({custId: req.params.custID});
		console.log(msg);
		res.status(200).send(msg);
	}
	catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
})

app.delete('/messages/:_id', async (req, res) => {
	try {
		const msg = await message.findByIdAndDelete(req.params._id);
		res.status(200);
	}
	catch (err) {
		console.log(err);
		res.status(303).send(err);
	}
})

app.put('/messages/:_id', async (req, res) => {
	try {
		await message.findByIdAndUpdate(req.params._id, req.body);
		res.status(200).send(true);
	}
	catch(err) {
		console.log(err);
		res.status(303).send(false);
	}
})

module.exports = app;