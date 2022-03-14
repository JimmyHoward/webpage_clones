const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const uuid = require('uuid');
const members = require('../../Members');

// gets all members
router.get('/', (req, res) => res.json(members));

// get single member
router.get('/:id', (req, res) => {
    const found = members.some(
        (member) => member.id.toString() === req.params.id
    );
    if (found) {
        res.json(
            members.filter((member) => member.id.toString() === req.params.id)
        );
    } else {
        res.status(400).json({ msg: 'Member not found.' });
    }
});

// Create member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active',
    };

    if (!newMember.name || !newMember.email) {
        return res
            .status(400)
            .json({ msg: 'Please include a name and an email.' });
    }

    members.push(newMember);
    res.json(members);
});

// update member
router.put('/:id', (req, res) => {
    const found = members.some(
        (member) => member.id.toString() === req.params.id
    );
    if (found) {
        const updMember = req.body;
        members.forEach((member) => {
            if (member.id.toString() === req.params.id) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;

                res.json({ msg: 'Member updated successfully', member });
            }
        });
    } else {
        res.status(400).json({ msg: 'Member not found' });
    }
});

// Delete member
router.delete('/:id', (req, res) => {
    const found = members.some(
        (member) => member.id.toString() === req.params.id
    );
    if (found) {
        res.json({
            msg: 'Member deleted',
            members: members.filter(
                (member) => member.id.toString() !== req.params.id
            ),
        });
    } else {
        res.status(400).json({ msg: 'Member not found.' });
    }
});

module.exports = router;
