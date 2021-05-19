const express = require("express")
const Money = require("../models/money")
const auth = require("../middleware/auth")
const router = new express.Router()

/*  POST - CREATE money  */
router.post('/moneys', auth, async (req, res) => {
    const money = new Money({
        /*  ES6 spread operator is like what Todd McCleod calls "Unfurling" in Golang.
        **  It grabs all of the properties from "req.body" in this case and copies them
        **  to this object.  Here we're copying the 'description' and 'completed' properties.
        */
       
        ...req.body,
        owner:req.user._id
    })

   //const money = new money(req.body);

    try {
        await money.save()
        res.status(201).send(money)
    } catch (e) {
        res.status(400).send(error)
    }
})

/*  DELETE - DELETE money    */
router.delete("/moneys/:id", auth, async (req, res) => {
    try {
        const money = await Money.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!money) {
            res.status(404).send()
            return
        }
        res.status(200).send(money)
    } catch (e) {
        res.status(500).send()
    }
})

/*  PATCH - UPDATE money */
router.patch("/moneys/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'status']
    const isValidOperation = updates.every((updateKeyName) => {
        return allowedUpdates.includes(updateKeyName)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const money = await Money.findOne({ _id: req.params.id, owner: req.user._id })
        if (!money) {
            res.status(404).send()
            return
        }
        
        updates.forEach((update) => {
            money[update] = req.body[update]
        })
        await money.save()
        res.status(200).send(money)
    } catch (e) {
        res.status(400).send(e)
    }
})

/*  GET - RETREIVE moneyS. URL OPTIONS:
**          /moneys?completed=true
**          /moneys?limit=10&skip=0
**          /moneys?sortBy=createdAt_asc
**          /moneys?sortBy=updatedAt_desc
*/
router.get("/moneys", auth, async (req, res) => {
    const match = {}
    const sort = {}

    /*  NB: req.query.completed is a STRING.  Hence if the string
    **  is non-empty then the if statement will resolve to true
    */
    if (req.query.completed) {
        if (req.query.completed === "true") {
            match.completed = true
        } else if (req.query.completed === "false") {
            match.completed = false
        }
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = (parts[1] === "asc") ? 1 : -1
    }

    try {
        /* You could also replace the lines below with:
        **      const moneys = await money.find({ owner: req.user._id, completed: false })
        **      res.status(200).send(moneys)
        */
        await req.user.populate({
            path:   'myMoneys',
            match:  match,
            options: {
                /*  if req.query.limit is not provided then the following resolves 
                **  to NaN (not a number) and mongoose proceeds to ignore the limit.
                */
                limit:  parseInt(req.query.limit),
                skip:   parseInt(req.query.skip),
                sort:   sort
            },
        }).execPopulate()
        res.status(200).send(req.user.myMoneys)
    } catch (e) {
        res.status(500).send(e)
    }
})

/*  GET - RETREIVE SPECIFIC money BY ID  */
router.get("/moneys/:id", auth, async (req, res) => {
    try {
        const money = await Money.findOne({ _id: req.params.id, owner: req.user._id })
        if (!money) {
            res.status(404).send()
            return
        }
        res.status(200).send(money)
    } catch (e) {
        res.status(500).send(error)
    }
})

module.exports = router