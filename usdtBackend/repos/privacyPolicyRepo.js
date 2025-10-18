const privacyPolicyModel = require("../models/privacyPolicyModel");

const getAllPrivacyPolicies = async () => {
    try {
        const policies = await privacyPolicyModel.find({ isActive: true }).sort({ createdAt: -1 });
        return policies;
    } catch (error) {
        throw error;
    }
};

const getPrivacyPolicyById = async (id) => {
    try {
        const policy = await privacyPolicyModel.findById(id);
        return policy;
    } catch (error) {
        throw error;
    }
};

const createPrivacyPolicy = async (policyData) => {
    try {
        const policy = new privacyPolicyModel(policyData);
        const savedPolicy = await policy.save();
        return savedPolicy;
    } catch (error) {
        throw error;
    }
};

const updatePrivacyPolicy = async (id, policyData) => {
    try {
        const updatedPolicy = await privacyPolicyModel.findByIdAndUpdate(
            id,
            { ...policyData, lastUpdated: new Date() },
            { new: true }
        );
        return updatedPolicy;
    } catch (error) {
        throw error;
    }
};

const deletePrivacyPolicy = async (id) => {
    try {
        const deletedPolicy = await privacyPolicyModel.findByIdAndDelete(id);
        return deletedPolicy;
    } catch (error) {
        throw error;
    }
};

const getLatestPrivacyPolicy = async () => {
    try {
        const policy = await privacyPolicyModel.findOne({ isActive: true }).sort({ lastUpdated: -1 });
        return policy;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllPrivacyPolicies,
    getPrivacyPolicyById,
    createPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    getLatestPrivacyPolicy,
};
