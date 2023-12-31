import Lottie from 'lottie-react'
import stampAnimation from '../assets/stamp.json'
import { useEffect, useState } from 'react'
import { getLocation, checkDistance } from '../utils/geo'
import { Place } from '../models/place'
import StampPhoto from './StampPhoto'
import { Stamp } from '../models/stamp'
import { PageLoading } from './PageLoader'

export const StampBox = ({
  placeDetail,
  stampDetail,
  onStamp,
}: {
  placeDetail: Place
  stampDetail: Stamp
  onStamp: () => void
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [isStamping, setStampStatus] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const handleStamp = () => {
    setIsConfirmModalOpen(false)
    setStampStatus(true)
    setTimeout(async () => {
      try {
        await onStamp()
      } finally {
        setStampStatus(false)
      }
    }, 2000)
  }

  const confirmStamp = async () => {
    try {
      setLoading(true)
      const position = await getLocation()
      const { latitude, longitude } = position.coords
      const inDestination = checkDistance(
        latitude,
        longitude,
        placeDetail?.location_lat,
        placeDetail?.location_lon,
      )
      if (inDestination) {
        handleStamp()
      } else {
        console.log('You are not in the destination')
        setIsConfirmModalOpen(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    console.log('====', stampDetail)
  }, [stampDetail])

  const StampModal = () => {
    return (
      <>
        <input
          type='checkbox'
          id='stamp_confirm_modal'
          className='modal-toggle'
          checked={isConfirmModalOpen}
          onChange={() => {}}
        />
        <dialog role='dialog' className='modal modal-bottom sm:modal-middle'>
          <div className='modal-box'>
            <h3 className='text-lg font-bold'>Warning</h3>
            <div role='alert' className='alert alert-info mt-4'>
              <span>
                You are not in the destination right now. Are you sure you want
                to stamp the place?
              </span>
            </div>
            <p className='py-4'></p>
            <div className='modal-action'>
              <button className='btn' onClick={handleStamp}>
                Yes
              </button>
              <button
                className='btn'
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      </>
    )
  }

  return (
    <div className='mt-6 flex h-48 w-full items-center justify-center rounded-md border-4 border-dotted border-gray-200'>
      {!isStamping && !stampDetail && (
        <div className='cursor-pointer' onClick={confirmStamp}>
          {!isLoading ? 'Click me to get stamp' : <PageLoading />}
        </div>
      )}
      {isStamping && (
        <Lottie
          className='h-full w-full'
          animationData={stampAnimation}
          loop={false}
        />
      )}
      {stampDetail && (
        <div className='align-center flex h-full w-full justify-center bg-contain bg-center bg-no-repeat text-center'>
          <StampPhoto imageUrl={placeDetail.photo} />
        </div>
      )}
      <StampModal />
    </div>
  )
}
