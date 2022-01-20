const show_list_of_apis = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //const { _id } = req.body;

    //const response = await book_services.deleteBook(_id);
    const response = {
        apis: "yesss",
    }
    return res.json(response)
}