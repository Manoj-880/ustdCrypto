const faqRepo = require("../repos/faqRepo");

const getAllFaqs = async (req, res) => {
    try {
    const faqs = await faqRepo.getAllFaqs();
    res.status(200).send({
        success: true,
        message: "FAQs fetched successfully",
        data: faqs,
    });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

const createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        // Validate required fields
        if (!question || !answer) {
            return res.status(400).send({
                success: false,
                message: "Question and answer are required",
            });
        }
        
        const faq = { question, answer };
        console.log('Creating FAQ with data:', faq);
        const newFaq = await faqRepo.createFaq(faq);
        console.log('FAQ created successfully:', newFaq);
        res.status(200).send({
            success: true,
            message: "FAQ created successfully",
            data: newFaq,
        });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        
        // Validate required fields
        if (!question || !answer) {
            return res.status(400).send({
                success: false,
                message: "Question and answer are required",
            });
        }
        
        const faq = { question, answer };
        const updatedFaq = await faqRepo.updateFaq(id, faq);
        res.status(200).send({
            success: true,
            message: "FAQ updated successfully",
            data: updatedFaq,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFaq = await faqRepo.deleteFaq(id);
        res.status(200).send({
            success: true,
            message: "FAQ deleted successfully",
            data: deletedFaq,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    getAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};