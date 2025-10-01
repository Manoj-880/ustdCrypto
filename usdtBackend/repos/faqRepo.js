const faqModel = require("../models/faqModel");

const getAllFaqs = async () => {
    return await faqModel.find();
};

const createFaq = async (faq) => {
    return await faqModel.create(faq);
};

const updateFaq = async (id, faq) => {
    return await faqModel.findByIdAndUpdate(id, faq);
};

const deleteFaq = async (id) => {
    return await faqModel.findByIdAndDelete(id);
};

module.exports = {
    getAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};