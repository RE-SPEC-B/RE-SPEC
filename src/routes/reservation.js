'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
const { validator } = require('../middlewares/validator');
const { check } = require('express-validator');

const ctrl = require('../controllers/reservation');

// 예약 추가
_router.post('/', [
        isLoggedIn,
        check('type')
            .notEmpty()
            .withMessage('Type is required')
            .isIn(['MT', 'PT'])
            .withMessage('Type must be MT or PT.'),
        check('duration', 'Duration is required').notEmpty(),
        check('proposed_start1', 'More than one proposed reservation time is required').notEmpty(),
        check('mentor_key', 'Mentor key is required').notEmpty(),
        validator,
    ],
    ctrl.createReservation,
);

// 멘토의 예약 확정
_router.post('/confirm', [
        isLoggedIn,
        check('reservation_key', 'Reservation Key is required').notEmpty(),
        check('start')
            .notEmpty()
            .withMessage('Start is required')
            .isISO8601()
            .toDate()
            .withMessage('Invalid start time'),
        validator,
    ],
    ctrl.confirmReservation,
);

// 멘토의 예약 목록 호출
_router.get('/list/mentor/:mentorkey', [
        isLoggedIn,
        check('mentorkey')
            .isInt()
            .withMessage('Mentorkey must be int'),
        validator,
    ], ctrl.getListOfMentor
);

module.exports = _router;
