/**
 * @swagger
 * definitions:
 *  Store:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: Bingo
 *    address:
 *     type: string
 *     example: Donji Hadzici bb
 *    city:
 *     type: string
 *     example: Hadzici
 *    latitude:
 *     type: number
 *     format: double
 *     example: 43.8317806
 *    longitude:
 *     type: number
 *     format: double
 *     example: 18.2134364
 *    working_hours:
 *     type: object
 *     properties:
 *      monday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '6:45'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      tuesday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '7:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      wednesday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '7:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      thursday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '7:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      friday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '7:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      saturday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '7:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *      sunday:
 *       type: object
 *       properties:
 *        opening:
 *         type: string
 *         example: '8:00'
 *        closing:
 *         type: string
 *         example: '21:00'
 *    loyalty_programs:
 *      type: array
 *      items:
 *       type: string
 *       example: cashback
 *      uniqueItems: true
 *    payment_method:
 *     type: object
 *     properties:
 *      cash:
 *       type: integer
 *       example: 1
 *      credit_card:
 *       type: integer
 *       example: 1
 *    required:
 *     - name
 *     - address
 *     - city
 *     - latitude
 *     - longitude
 *     - working_hours
 *     - payment_methods
 *     - loyalty_programs
 */
