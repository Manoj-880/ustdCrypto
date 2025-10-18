const termsModel = require("../models/termsModel");

const getAllTerms = async () => {
    try {
        const terms = await termsModel.find({ isActive: true }).sort({ createdAt: -1 });
        return terms;
    } catch (error) {
        throw error;
    }
};

const getTermsById = async (id) => {
    try {
        const terms = await termsModel.findById(id);
        return terms;
    } catch (error) {
        throw error;
    }
};

const createTerms = async (termsData) => {
    try {
        const terms = new termsModel(termsData);
        const savedTerms = await terms.save();
        return savedTerms;
    } catch (error) {
        throw error;
    }
};

const updateTerms = async (id, termsData) => {
    try {
        const updatedTerms = await termsModel.findByIdAndUpdate(
            id,
            { ...termsData, lastUpdated: new Date() },
            { new: true }
        );
        return updatedTerms;
    } catch (error) {
        throw error;
    }
};

const deleteTerms = async (id) => {
    try {
        const deletedTerms = await termsModel.findByIdAndDelete(id);
        return deletedTerms;
    } catch (error) {
        throw error;
    }
};

const getLatestTerms = async () => {
    try {
        const terms = await termsModel.findOne({ isActive: true }).sort({ lastUpdated: -1 });
        return terms;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllTerms,
    getTermsById,
    createTerms,
    updateTerms,
    deleteTerms,
    getLatestTerms,
};
