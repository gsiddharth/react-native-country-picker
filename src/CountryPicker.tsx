import React, { ReactNode, useState, useEffect } from 'react'
import { ModalProps, FlatListProps } from 'react-native'
import { CountryModal } from './CountryModal'
import { HeaderModal } from './HeaderModal'
import { Country, CountryCode, FlagType } from './types'
import { CountryFilter, CountryFilterProps } from './CountryFilter'
import { FlagButton } from './FlagButton'
import { useContext } from './CountryContext'
import { CountryList } from './CountryList'

interface State {
  visible: boolean
  countries: Country[]
  filter?: string
  filterFocus?: boolean
}

const renderFlagButton = (
  props: FlagButton['props'] & CountryPickerProps['renderFlagButton']
): ReactNode =>
  props.renderFlagButton ? (
    props.renderFlagButton(props)
  ) : (
    <FlagButton {...props} />
  )

const renderFilter = (
  props: CountryFilter['props'] & CountryPickerProps['renderCountryFilter']
): ReactNode =>
  props.renderCountryFilter ? (
    props.renderCountryFilter(props)
  ) : (
    <CountryFilter {...props} />
  )

interface CountryPickerProps {
  countryCode: CountryCode
  modalProps?: ModalProps
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFilter?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withFlag?: boolean
  withModal?: boolean
  visible?: boolean
  buttonTextColor?: string
  renderFlagButton?(props: FlagButton['props']): ReactNode
  renderCountryFilter?(props: CountryFilter['props']): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

export const CountryPicker = (props: CountryPickerProps) => {
  const {
    countryCode,
    renderFlagButton: renderButton,
    renderCountryFilter,
    filterProps,
    modalProps,
    flatListProps,
    onSelect,
    withEmoji,
    withFilter,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    withAlphaFilter,
    withCallingCode,
    withCurrency,
    withFlag,
    withModal,
    buttonTextColor,
    onClose: handleClose,
    onOpen: handleOpen
  } = props
  const [state, setState] = useState<State>({
    visible: props.visible || false,
    countries: [],
    filter: '',
    filterFocus: false
  })
  const { translation, getCountries } = useContext()
  const { visible, filter, countries, filterFocus } = state
  const onOpen = () => {
    setState({ ...state, visible: true })
    if (handleOpen) {
      handleOpen()
    }
  }
  const onClose = () => {
    setState({ ...state, filter: '', visible: false })
    if (handleClose) {
      handleClose()
    }
  }
  const setFilter = (filter: string) => setState({ ...state, filter })
  const setCountries = (countries: Country[]) =>
    setState({ ...state, countries })
  const onSelectClose = (country: Country) => {
    onSelect(country)
    onClose()
  }
  const onFocus = () => setState({ ...state, filterFocus: true })
  const onBlur = () => setState({ ...state, filterFocus: false })

  const flagProp = {
    withEmoji,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    countryCode,
    renderFlagButton: renderButton,
    onOpen,
    buttonTextColor
  }
  useEffect(() => {
    const countries = getCountries(
      withEmoji ? FlagType.EMOJI : FlagType.FLAT,
      translation
    )
    setCountries(countries)
  }, [translation, withEmoji])

  return (
    <>
      {withModal && renderFlagButton(flagProp)}
      <CountryModal
        {...{ visible, withModal, ...modalProps }}
        onRequestClose={onClose}
      >
        <HeaderModal
          {...{ withFilter, onClose }}
          renderFilter={(props: CountryFilter['props']) =>
            renderFilter({
              ...props,
              renderCountryFilter,
              onChangeText: setFilter,
              value: filter,
              onFocus,
              onBlur,
              ...filterProps
            })
          }
        />
        <CountryList
          {...{
            onSelect: onSelectClose,
            data: countries,
            letters: [],
            withAlphaFilter: withAlphaFilter && filter === '',
            withCallingCode,
            withCurrency,
            withFlag,
            withEmoji,
            filter,
            filterFocus,
            flatListProps
          }}
        />
      </CountryModal>
    </>
  )
}

CountryPicker.defaultProps = {
  withAlphaFilter: false,
  withCallingCode: false
}
