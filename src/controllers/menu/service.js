'use strict';

exports.searchMentoT = (req, res) => {
    // const { stack } = req.params;
    // const { sort } = req.query;
    // let order = null;

    // if (sort === 'hit') { order = [ ['hit', 'DESC'] ]; }
    // else { order = [ ['createdAt', 'DESC'] ]; } // null or other

    // Content.findAndCountAll({
    //     where: { stack: stack },
    //     order: order,
    // }).then((data) => {
    //     let tip = new Array();
    //     let question = new Array();
    //     let share = new Array();

    //     for( let i = 0; i < data.count ; i++ ) {
    //         if (data.rows[i].tag === 'tip') { tip.push(data.rows[i]) }
    //         else if (data.rows[i].tag === 'question') { question.push(data.rows[i]) } 
    //         else { share.push(data.rows[i]) } // share
    //     }

    //     return res.status(200).json({ 
    //         tip: tip,
    //         question: question,
    //         share: share
    //     });
    // }).catch((err) => {
    //     return res.status(500).json({ err });
    // });
};

exports.searchMentoB = (req, res) => {
}