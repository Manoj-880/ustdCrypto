const privacyPolicyRepo = require("../repos/privacyPolicyRepo");

// Get all privacy policies (for admin)
const getAllPrivacyPolicies = async (req, res) => {
    try {
        const policies = await privacyPolicyRepo.getAllPrivacyPolicies();
        res.status(200).send({
            success: true,
            message: "Privacy policies fetched successfully",
            data: policies,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get latest privacy policy (for users)
const getLatestPrivacyPolicy = async (req, res) => {
    try {
        const policy = await privacyPolicyRepo.getLatestPrivacyPolicy();
        if (!policy) {
            return res.status(404).send({
                success: false,
                message: "No privacy policy found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Privacy policy fetched successfully",
            data: policy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get privacy policy by ID
const getPrivacyPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await privacyPolicyRepo.getPrivacyPolicyById(id);
        if (!policy) {
            return res.status(404).send({
                success: false,
                message: "Privacy policy not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Privacy policy fetched successfully",
            data: policy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Create new privacy policy
const createPrivacyPolicy = async (req, res) => {
    try {
        const { title, content, sections } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).send({
                success: false,
                message: "Title and content are required",
            });
        }
        
        const policyData = { title, content, sections: sections || [] };
        const newPolicy = await privacyPolicyRepo.createPrivacyPolicy(policyData);
        res.status(201).send({
            success: true,
            message: "Privacy policy created successfully",
            data: newPolicy,
        });
    } catch (error) {
        console.error('Error creating privacy policy:', error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update privacy policy
const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, sections } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).send({
                success: false,
                message: "Title and content are required",
            });
        }
        
        const policyData = { title, content, sections: sections || [] };
        const updatedPolicy = await privacyPolicyRepo.updatePrivacyPolicy(id, policyData);
        if (!updatedPolicy) {
            return res.status(404).send({
                success: false,
                message: "Privacy policy not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Privacy policy updated successfully",
            data: updatedPolicy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete privacy policy
const deletePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPolicy = await privacyPolicyRepo.deletePrivacyPolicy(id);
        if (!deletedPolicy) {
            return res.status(404).send({
                success: false,
                message: "Privacy policy not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Privacy policy deleted successfully",
            data: deletedPolicy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getAllPrivacyPolicies,
    getLatestPrivacyPolicy,
    getPrivacyPolicyById,
    createPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
};
