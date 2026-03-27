export interface GenSettings {
  clientName: string;
  headlineCount: number;
  headlineLength: number;
  descriptionCount: number;
  descriptionLength: number;
  tone: ToneOption;
}
export const defaultGenSettings: GenSettings = {
  clientName: "",
  headlineCount: 15,
  headlineLength: 30,
  descriptionCount: 4,
  descriptionLength: 90,
  tone: "přátelský",
};
