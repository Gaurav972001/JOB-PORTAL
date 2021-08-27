const express = require('express');
const router = express.Router();
const {ensureAuth}= require('../middleware/auth');
const Job= require('../models/Job')

//show add page
//@route get /jobs/add
router.get('/add', ensureAuth, (req, res)=>{
    res.render('jobs/add');
});

//Process add form
//@route   POST /jobs
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Job.create(req.body)
      res.redirect('/admin')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  });

// Show all jobs
// @route   GET /jobs
router.get('/', ensureAuth, async (req, res) => {
    try {
      const jobs = await Job.find({ status: 'active' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean();
  
      res.render('jobs/index', {
        jobs,
      });
    } catch (err) {
      console.error(err);
      res.render('error/500');
    }
  });

//Show edit page
// @route   GET /jobs/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!job) {
        return res.render('error/404');
      }
  
      if (job.user != req.user.id) {
        res.redirect('/jobs');
      } else {
        res.render('jobs/edit', {
          job,
        })
      }
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

//Update job
// @route   PUT /job/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let job = await Job.findById(req.params.id).lean()
  
      if (!job) {
        return res.render('error/404')
      }
  
      if (job.user != req.user.id) {
        res.redirect('/jobs')
      } else {
        story = await Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/admin')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  });

// Delete job
// @route   DELETE /jobs/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let job = await Job.findById(req.params.id).lean();
  
      if (!job) {
        return res.render('error/404');
      }
  
      if (job.user != req.user.id) {
        res.redirect('/jobs');
      } else {
        await job.remove({ _id: req.params.id });
        res.redirect('/admin');
      }
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

//Show single job
// @route   GET /job/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
      let job = await Job.findById(req.params.id).populate('user').lean()
  
      if (!job) {
        return res.render('error/404')
      }
  
      if (job.user._id != req.user.id && job.status == 'private') {
        res.render('error/404')
      } else {
        res.render('jobs/show', {
          job,
        })
      }
    } catch (err) {
      console.error(err)
      res.render('error/404')
    }
  });

// User jobs
// @route   GET /jobs/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const jobs = await Job.find({
        user: req.params.userId,
        status: 'active',
      })
        .populate('user')
        .lean()
  
      res.render('jobs/index', {
        jobs,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports=router