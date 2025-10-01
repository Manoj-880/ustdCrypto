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
        const faq = req.body;
        const newFaq = await faqRepo.createFaq(faq);
        res.status(200).send({
            success: true,
            message: "FAQ created successfully",
            data: newFaq,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

const updateFaq = async (req, res) => {
    try {
        const faq = req.body;
        const updatedFaq = await faqRepo.updateFaq(faq);
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
        const faq = req.body;
        const deletedFaq = await faqRepo.deleteFaq(faq);
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