import Review from '../models/Review.js'

import { sanitizeHtml } from '../utils/sanitize.js'

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
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username')

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

export const getBySlug = async (req, res) => {
  try {
    const userId = req.user.userId
    const slug = req.query.slug

    if (!slug) {
      throw new Error('Slug tidak ditemukan')
    }

    const review = await Review.findOne({ slug, userId }).populate('userId', 'username')

    if (!review) {
      throw new Error('Review tidak ditemukan')
    }

    res.json({
      status: true,
      message: 'Berhasil mengambil data review',
      data: review
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat mengambil data review',
      data: null
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

    const cleanContent = sanitizeHtml(content)

    const review = new Review({
      userId,
      title,
      slug,
      status,
      coverImage,
      description,
      content: cleanContent,
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

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.userId
    const slug = req.query.slug

    if (!slug) {
      throw new Error('Slug tidak ditemukan')
    }

    const review = await Review.findOneAndDelete({ slug, userId })

    if (!review) {
      throw new Error('Review tidak ditemukan')
    }

    res.json({
      status: true,
      message: 'Review berhasil dihapus',
      data: null
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat menghapus review',
      data: null
    })
  }
}
