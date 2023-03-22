'use strict';

const _express = require('express');
const _router = _express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
const { check, body, validationResult } = require('express-validator');

// 검증 미들웨어
const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ message: errors.array()[0].msg });
};
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
        validator,
    ],
    ctrl.createReservation,
);

// 멘토의 예약 확정
_router.post('/confirm/', [
        isLoggedIn,
        check('reservation_key', 'Reservation Key is required').notEmpty(),
        check('start', 'Start is required').notEmpty(),
        validator,
    ],
    ctrl.confirmReservation,
);

module.exports = _router;
