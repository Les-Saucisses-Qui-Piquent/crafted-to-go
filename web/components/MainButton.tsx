import {useStyles, createStyleSheet} from 'styles';
import {useVariants} from 'react-exo/utils';
import {View, Text} from 'react-native';

export interface MainButtonProps {
  secondary: typeof MainButtonVariants.secondary[number],
  /** Used to locate this view in end-to-end tests. */
  testID?: string,
}

export const MainButtonVariants = {
  secondary: ['False', 'True'],
} as const;

export function MainButton(props: MainButtonProps) {
  const {secondary} = props;
  const {styles} = useStyles(stylesheet);
  const {vstyles} = useVariants(MainButtonVariants, {secondary}, styles);

  return (
    <View style={vstyles.root()} testID={props.testID ?? "100:2007"}>
      <View style={vstyles.group16()} testID="100:1646">
        <View style={vstyles.rectangle20()} testID="100:1647"/>
        <Text style={vstyles.ajouterAuPanier()} testID="100:1648">
          {`Ajouter au panier`}
        </Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  root: {
    flexDirection: 'row',
    width: 208,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rectangle20: {
    width: 208,
    height: 36,
    flexShrink: 0,
    backgroundColor: 'rgba(201, 227, 217, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.250980406999588)',
    shadowRadius: 4,
    shadowOffset: {"width":0,"height":4},
  },
  rectangle20SecondaryTrue: {
    backgroundColor: 'rgba(253, 255, 208, 1)',
  },
  ajouterAuPanier: {
    width: 158,
    height: 20,
    flexShrink: 0,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'center',
    fontFamily: 'Hanken Grotesk',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
  },
  group16: {
    width: 208,
    height: 36,
    flexShrink: 0,
  },
}));
