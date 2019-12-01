/**
 * @swagger
 * definitions:
 *  Product:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: Haribo gumene bobe
 *    description:
 *     type: string
 *     example: Gumene bobe sa okusom voća
 *    category:
 *     type: string
 *     example: FOOD
 *    subcategory:
 *     type: string
 *     example: SWEETS
 *    producer:
 *     type: string
 *     example: HARIBO
 *    barcode:
 *     type: integer
 *     format: int64
 *     example: 4001686300404
 *    quantity:
 *     type: integer
 *     example: 350
 *    unit:
 *     type: string
 *     example: g
 *    date_added:
 *     type: time_t
 *     example: 1557858060
 *    image:
 *     type: string
 *     example: https://intanrastini.files.wordpress.com/2018/03/haribo-pack.jpg?w=201
 *    country_of_origin:
 *     type: string
 *     example: Germany
 *    required:
 *     - name
 *     - description
 *     - category
 *     - subcategory
 *     - producer
 *     - barcode
 *     - quantity
 *     - unit
 *     - date_added
 *     - image
 *     - country_of_origin
 */
