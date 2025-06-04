import { useState } from "react";
import DateTimePicker, {
  DateType,
  useDefaultClassNames,
  useDefaultStyles,
} from "react-native-ui-datepicker";

export function Calendar() {
  //   const defaultStyles = useDefaultStyles("light");
  const defaultClassNames = useDefaultClassNames();

  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => setSelected(date)}
      //   styles={defaultStyles}
      classNames={defaultClassNames}
      initialView="year"
    />
  );
}
