// const { OpenAI } = require("openai");

// const openai = new OpenAI({
//     apiKey: "sk-proj-RXZ5b7X49BmllPQcObjfT3BlbkFJa8fCC9Jf5GsnwActnOqg" // Asegúrate de que esta variable esté definida en tu entorno
// });

// const getMangaRecommendation = async (req, res) => {
//     try {
//         const response = await openai.completions.create({
//             model: "gpt-3.5-turbo",
//             prompt: "Hello world",
//             max_tokens: 50
//         });

//         console.log(response.choices[0].text);

//         res.status(200).json({
//             status: "success",
//             message: "Recommendation success",
//             recommendation: response.choices[0].text // Incluye la recomendación en la respuesta
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "failed",
//             message: error.message
//         });
//     }
// };

// module.exports = getMangaRecommendation;
