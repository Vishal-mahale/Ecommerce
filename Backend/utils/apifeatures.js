class ApiFeature {
  constructor (query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }
  // function to search the product name
  search () {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //Regular expression to find the matching values
            $options: 'i' //Case insensitivity
          }
        }
      : {}
    // console.log(keyword)
    this.query = this.query.find({ ...keyword }) //modifying the query.
    return this //returning a class
  }

  //function to remove
  filter () {
    //to get the copy of queryStr.objects are passed by reference. const copyQuery = this.queryStr not.
    const copyQuery = { ...this.queryStr }

    const removeFields = ['page', 'keyword', 'limit'] //removing fields from the url. *i.e. to get category.

    removeFields.forEach(key => delete copyQuery[key]) //'page', 'keyword', 'limit' words from array will get remove form copyQuery.

    //To add the doller signs to the query.
    let queryStr = JSON.stringify(copyQuery)
    queryStr = queryStr.replace(/\b(gt|lt|lte|gte)\b/g, key => `$${key}`)

    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }
  pagination (resultPerPage) {
    //gets the value from the url. one(1) if not provided.
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = currentPage * (resultPerPage - 1)
    // console.log(currentPage, skip);
    this.query = this.query.limit(resultPerPage).skip(skip) //mongodb functions.
    return this
  }
}
module.exports = ApiFeature
