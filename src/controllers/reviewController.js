import Review from '../models/Review.js'

export const getAll = async (req, res) => {
  try {
    const userId = req.user.userId
    const page = parseInt(req.query.page) || 1
    const limit = 6
    const keyword = req.query.keyword?.trim() || ''
    const status = req.query.status?.trim() || ''

    const filter = {
      userId
    }

    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' }
    }

    if (status === 'watched' || status === 'unwatched') {
      filter.status = status === 'watched'
    }

    const skip = (page - 1) * limit
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.json({
      status: true,
      message: 'Berhasil mengambil data review',
      data: reviews
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat mengambil data review',
      data: []
    })
  }
}

export const create = async (req, res) => {
  try {
    const userId = req.user.userId

    const {
      title,
      slug: originalSlug,
      status,
      coverImage,
      description,
      content
    } = req.validatedBody

    if (typeof status !== 'boolean') {
      throw new Error('Status tidak valid')
    }

    const isSlugExists = await Review.findOne({ slug: originalSlug, userId })

    let slug = originalSlug

    if (isSlugExists) {
      const randomSuffix = Math.random().toString(36).substring(2, 7)

      slug = `${slug}-${randomSuffix}`
    }

    const review = new Review({
      userId,
      title,
      slug,
      status,
      coverImage,
      description,
      content,
      createdAt: new Date(),
      updatedAt: null
    })

    await review.save()

    res.status(200).json({
      status: true,
      message: 'Review berhasil dibuat',
      data: review
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat membuat review'
    })
  }
}
