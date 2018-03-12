import pandas as pd

efficiencies_df = pd.read_csv('./cleanedData/efficiencyClean2002.csv')

print(efficiencies_df.columns.values)
print(efficiencies_df.head())
