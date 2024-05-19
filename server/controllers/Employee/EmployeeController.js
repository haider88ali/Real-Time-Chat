const Employee=require('../../models/Employee');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const {db,executeQuery} = require('../../db/connection')
const upload = multer({ storage: storage });
module.exports={
getAllEmployees: async (req,res) => {
        
    try {
        const query = 'SELECT u.name, u.id ,u.email FROM students u';
        const results = await executeQuery(query); // Assuming executeQuery is a promise-based function
        
        // Calculate the total number of pages
        // Calculate the start and end indexes for the requested page
        // const startIndex = (page - 1) * pageSize;
        // const endIndex = page * pageSize;
        // const paginatedProducts = results.slice(startIndex, endIndex);

        res.json({ data: results });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} ,
// Create employee controller
 createEmployee : async (req, res) => {
    try {
        // Parse form data and file upload
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ error: 'Error uploading file' });
            }

            const employeeData = req.body;
            console.log('Received employee data:', employeeData);

            // Add image buffer to employeeData if it exists
            if (req.file) {
                employeeData.image = req.file.buffer;
            }
            console.log('Modified employee data:', employeeData);

            // Create employee in the database
            const result = await Employee.create(employeeData);
            res.status(200).json({
                data: result,
                message: "Employee created successfully",
                status: 200,
            });
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Error creating employee' });
    }
}
};