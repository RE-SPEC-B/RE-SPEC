'use strict';

const { Careerinfo, Educationinfo, Companysizeinfo, Job, Characteristic } = require('../utils/connect');

/**
 * 멘토 찾기에 필요한 ENUM 값을 불러오는 함수
 */
exports.enumValueGet = async (req, res) => {
    let data = {}, temp_data;
    temp_data = await Careerinfo.findAll({ attributes: ['enum', ['career', 'value']] })
    data.Career = temp_data;

    temp_data = await Educationinfo.findAll({ attributes: ['enum', ['education', 'value']] })
    data.Education = temp_data;

    temp_data = await Companysizeinfo.findAll({ attributes: ['enum', ['company_size', 'value']] })
    data.Company = temp_data;

    temp_data = await Job.findAll({ attributes: [['job_enum', 'enum'], ['job', 'value']] })
    data.Job = temp_data;

    temp_data = await Characteristic.findAll({ attributes: [['characteristic_enum', 'enum'], ['characteristic', 'value']] })
    data.Characteristic = temp_data;

    return data;
}