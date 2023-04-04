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
            .withMessage('Type is required.')
            .isIn(['MT', 'PT'])
            .withMessage('Type must be MT or PT.'),
        check('duration', 'Duration is required.').notEmpty(),
        check('mentor_key', 'Mentor key is required.').notEmpty(),
        validator,
    ],
    ctrl.createReservation,
);

// 멘토의 예약 확정
_router.post('/confirm/:reservationkey', [
        isLoggedIn,
        check('reservationkey', 'Reservation Key is required.').notEmpty(),
        check('start')
            .notEmpty()
            .withMessage('Start is required.')
            .isISO8601()
            .toDate()
            .withMessage('Invalid start time.'),
        validator,
    ],
    ctrl.confirmReservation,
);

// 멘토의 예약 거절
_router.post('/reject/:reservationkey', [
        isLoggedIn,
        check('is_reapply_available')
            .notEmpty()
            .withMessage('is_reapply_available is required')
            .isBoolean()
            .withMessage('is_reapply_available must be boolean'),
        validator,
    ],
    ctrl.rejectReservation,
);

// 멘토의 예약 목록 호출
_router.get('/mentor/:mentorkey/:status/list', [
        check('mentorkey')
            .isInt()
            .withMessage('Mentorkey must be int.'),
        check('status')
            .notEmpty()
            .withMessage('status is required.')
            .isIn(['wait', 'confirm'])
            .withMessage('You must input value of status wait or confirm.'),
        validator,
    ],
    ctrl.getListOfMentor,
);

module.exports = _router;
