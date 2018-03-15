import pandas as pd
from sklearn.linear_model import LogisticRegression

efficiencies_df = pd.read_csv('./combinedSheet.csv')

print(efficiencies_df.columns.values)
print(efficiencies_df.head())
