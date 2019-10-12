import React, { memo } from 'react'
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native'
import { CountryCode } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { getCountryCallingCode } from './CountryService'
import { CountryText } from './CountryText'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  containerWithEmoji: {
    marginTop: 0
  },
  containerWithoutEmoji: {
    marginTop: 5
  },
  flagWithSomethingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  something: { fontSize: 16 }
})

type FlagWithSomethingProp = Pick<
  FlagButtonProps,
  | 'countryCode'
  | 'withEmoji'
  | 'withCountryNameButton'
  | 'withCurrencyButton'
  | 'withCallingCodeButton'
  | 'buttonTextColor'
>

const FlagWithSomething = memo(
  ({
    countryCode,
    withEmoji,
    withCountryNameButton,
    withCurrencyButton,
    withCallingCodeButton,
    buttonTextColor
  }: FlagWithSomethingProp) => {
    const { translation, getCountryName, getCountryCurrency } = useContext()
    const countryName =
      withCountryNameButton && getCountryName(countryCode, translation)
    const currency = withCurrencyButton && getCountryCurrency(countryCode)
    const callingCode =
      withCallingCodeButton && getCountryCallingCode(countryCode)
    return (
      <View style={styles.flagWithSomethingContainer}>
        <Flag {...{ withEmoji, countryCode }} />
        {countryName ? (
          <CountryText style={[styles.something]}>
            {countryName + ' '}
          </CountryText>
        ) : null}
        {currency ? (
          <CountryText style={styles.something}>{`(${currency}) `}</CountryText>
        ) : null}
        {callingCode ? (
          <CountryText
    buttonTextColor
            style={[styles.something, {color: buttonTextColor}]}
          >{`+${callingCode}`}</CountryText>
        ) : null}
      </View>
    )
  }
)

interface FlagButtonProps {
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  countryCode: CountryCode,
  buttonTextColor?: string,
  onOpen?(): void
}

export const FlagButton = ({
  withEmoji,
  withCountryNameButton,
  withCallingCodeButton,
  withCurrencyButton,
  countryCode,
  onOpen,
  buttonTextColor,
}: FlagButtonProps) => {
  const withSomething =
    withCountryNameButton || withCallingCodeButton || withCurrencyButton
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
      <View
        style={[
          styles.container,
          withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji
        ]}
      >
        {withSomething ? (
          <FlagWithSomething
            {...{
              countryCode,
              withEmoji,
              withCountryNameButton,
              withCallingCodeButton,
              withCurrencyButton,
              buttonTextColor
            }}
          />
        ) : (
          <Flag {...{ countryCode, withEmoji }} />
        )}
      </View>
    </TouchableOpacity>
  )
}

FlagButton.defaultProps = {
  withEmoji: Platform.OS === 'ios',
  withCountryNameButton: false,
  withCallingCodeButton: false,
  withCurrencyButton: false,
  buttonTextColor: "#000"
}
