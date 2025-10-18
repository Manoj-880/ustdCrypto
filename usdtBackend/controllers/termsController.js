const termsRepo = require("../repos/termsRepo");

// Get all terms (for admin)
const getAllTerms = async (req, res) => {
    try {
        const terms = await termsRepo.getAllTerms();
        res.status(200).send({
            success: true,
            message: "Terms fetched successfully",
            data: terms,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get latest terms (for users)
const getLatestTerms = async (req, res) => {
    try {
        const terms = await termsRepo.getLatestTerms();
        if (!terms) {
            return res.status(404).send({
                success: false,
                message: "No terms and conditions found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Terms fetched successfully",
            data: terms,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get terms by ID
const getTermsById = async (req, res) => {
    try {
        const { id } = req.params;
        const terms = await termsRepo.getTermsById(id);
        if (!terms) {
            return res.status(404).send({
                success: false,
                message: "Terms not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Terms fetched successfully",
            data: terms,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Create new terms
const createTerms = async (req, res) => {
    try {
        const { title, content, sections } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).send({
                success: false,
                message: "Title and content are required",
            });
        }
        
        const termsData = { title, content, sections: sections || [] };
        const newTerms = await termsRepo.createTerms(termsData);
        res.status(201).send({
            success: true,
            message: "Terms created successfully",
            data: newTerms,
        });
    } catch (error) {
        console.error('Error creating terms:', error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update terms
const updateTerms = async (req, res) => {
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
        
        const termsData = { title, content, sections: sections || [] };
        const updatedTerms = await termsRepo.updateTerms(id, termsData);
        if (!updatedTerms) {
            return res.status(404).send({
                success: false,
                message: "Terms not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Terms updated successfully",
            data: updatedTerms,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete terms
const deleteTerms = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTerms = await termsRepo.deleteTerms(id);
        if (!deletedTerms) {
            return res.status(404).send({
                success: false,
                message: "Terms not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Terms deleted successfully",
            data: deletedTerms,
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
    getAllTerms,
    getLatestTerms,
    getTermsById,
    createTerms,
    updateTerms,
    deleteTerms,
};
