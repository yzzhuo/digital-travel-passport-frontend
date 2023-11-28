import { useEffect, useState } from 'react'
import Bg from '../assets/passport_bg.jpg'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import { PageLayout } from '../component/PageLayout'
import { fetchStamps, fetchUsers } from '../services/api'
import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { type Stamp } from '../models/stamp'
import dayjs from 'dayjs'
import MessageBadge from '../component/MessageBadge'
import StampPhoto from '../component/StampPhoto'
import { User } from '../models/user'
import { PageLoading } from '../component/PageLoader'

export default function Passport() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const currentStampId = queryParams.get('stampid')
  const { user, getAccessTokenSilently } = useAuth0()
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [stampIndex, setCurrentStampIndex] = useState<number>(-1)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isShowBadge, setIsShowBadge] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    getStamps()
  }, [])

  const getCurrentUser = async () => {
    const accessToken = await getAccessTokenSilently()
    const data = await fetchUsers(accessToken)
    if (!data.error) {
      const currentUser = data.data.results.find((item) => {
        const formatId = user.sub.replace('|', '.')
        return item.username === formatId
      })
      setCurrentUser(currentUser)
      return currentUser
    } else {
      alert('Error fetching user')
    }
  }

  const gotoPlacePage = () => {
    window.location.href = '/place'
  }

  const getStamps = async () => {
    let user = currentUser
    if (!currentUser) {
      user = await getCurrentUser()
    }
    const accessToken = await getAccessTokenSilently()
    const response = await fetchStamps(accessToken, {
      user: user.id + '',
    })
    if (response.error) {
      alert('Error fetching stamps')
    }
    const data = response.data
    setStamps(data.results)

    if (currentStampId) {
      const stamp = data.results.find((stamp) => stamp.id === currentStampId)
      if (stamp) {
        const stampIndex = data.results.findIndex(
          (stamp) => stamp.id === currentStampId,
        )
        setCurrentStampIndex(stampIndex)
      }
    }
    setIsLoaded(true)
  }

  const handleNext = () => {
    if (stampIndex === stamps.length - 1) {
      return
    }
    setCurrentStampIndex(stampIndex + 1)
  }

  const handlePrev = () => {
    if (stampIndex === -1) {
      return
    }
    setCurrentStampIndex(stampIndex - 1)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setIsShowBadge(true)
    setTimeout(() => {
      setIsShowBadge(false)
    }, 3000)
  }
  return (
    <PageLayout>
      {isLoaded ? (
        <div
          className='relative flex items-center justify-center p-6 pb-24'
          style={{ minHeight: '100%' }}
        >
          {stampIndex === -1 && (
            <div
              style={{ height: 568 }}
              className='card w-full bg-primary text-primary-content shadow-xl'
            >
              <div className='card-body flex flex-col'>
                <h2 className='card-title text-3xl'>My Travel Passport</h2>
                <div className='mt-8 flex-auto'>
                  <img src={Bg} alt='bg' className='background-contain' />
                </div>
                <div className='stats shadow'>
                  <div className='stat'>
                    <div className='stat-title'>Stamps</div>
                    <div className='stat-value'>{stamps.length}</div>
                    {/* <div className='stat-desc'>21% more than last month</div> */}
                  </div>
                  <div className='stat'>
                    <div className='stat-title'>Regions</div>
                    <div className='stat-value'>0</div>
                  </div>
                </div>
                <div className='card-actions mb-4 mt-2 flex justify-center'>
                  {stamps.length > 0 ? (
                    <div className='flex'>
                      <button
                        className='btn btn-secondary'
                        onClick={() => handleNext()}
                      >
                        Open Passport
                      </button>
                      <button
                        className='btn btn-warning ml-4'
                        onClick={() => handleShare()}
                      >
                        Share
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={gotoPlacePage}
                      className='btn btn-secondary'
                    >
                      Start Exploring
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {stampIndex >= 0 && (
            <div
              style={{ height: 560 }}
              className='card w-full border-2 border-solid border-primary'
            >
              <div className='card-body flex flex-col'>
                <h2 className='card-title'>{stamps[stampIndex].place.name}</h2>
                <div className='mt-1  flex h-48 w-full flex-auto items-center  justify-center border-4 border-dotted border-gray-200'>
                  <StampPhoto imageUrl={stamps[stampIndex].place.photo} />
                </div>
                <div>
                  {stamps[stampIndex].id} -{stamps[stampIndex].notes}
                </div>
                <div className='mt-4 grid grid-cols-3 gap-1'>
                  {(stamps[stampIndex].photos || []).map((stampPhoto) => {
                    return (
                      <div key={stampPhoto.id} className='w-full'>
                        <img src={stampPhoto.photo} />
                      </div>
                    )
                  })}
                </div>
                <div className='mt-4 flex flex-col '>
                  <div className='mt-2 flex items-center'>
                    <CalendarDaysIcon className='mr-1 h-6 w-6' />
                    <span>
                      {dayjs(stamps[stampIndex].time_of_visit).format(
                        'DD/MM/YYYY',
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {stampIndex >= 0 && (
            <button
              className='btn btn-circle absolute left-2'
              style={{ top: '20%' }}
              onClick={handlePrev}
            >
              <ChevronLeftIcon className='h-6 w-6 cursor-pointer' />
            </button>
          )}
          {stampIndex < stamps.length - 1 && (
            <button
              onClick={handleNext}
              className='btn btn-circle absolute right-2'
              style={{ top: '20%' }}
            >
              <ChevronRightIcon className='h-6 w-6 cursor-pointer' />
            </button>
          )}
          {isShowBadge && (
            <MessageBadge text={' Link copied. Send it to your friend now.'} />
          )}
        </div>
      ) : (
        <PageLoading />
      )}
    </PageLayout>
  )
}
