import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier

data = pd.read_csv('./combinedCleanedData.csv')
X_test = pd.read_csv('./newMarchMaddness2.csv')

data = data[np.isfinite(data['TeamOeff'])]
data = data[np.isfinite(data['TeamDeff'])]
data = data[np.isfinite(data['OppOeff2'])]
data = data[np.isfinite(data['OppDeff2'])]
data = data[np.isfinite(data['Spread'])]

X_test = X_test.drop(['Team', 'Opponent', 'Spread'], axis=1)
#print(data.columns.values)
#print(data.head())

#print(data.info())
#print(data.describe())

#print(data['Spread'].unique())

X_train = data.drop(['Team', 'Opponent', 'Result', 'Spread'], axis=1)
Y_train = data['Result']
print(X_train.head())
print(Y_train.head())
print(X_test)

# logreg = LogisticRegression()
# logreg.fit(X_train, Y_train)
# Y_pred = logreg.predict(X_test)

knn = KNeighborsClassifier(n_neighbors = 3)
knn.fit(X_train, Y_train)
Y_pred = knn.predict(X_test)
Y_prob = knn.predict_proba(X_test)

# print(Y_pred)
print(Y_prob)

np.savetxt('./results.csv', Y_pred, delimiter=',')
np.savetxt('./resultsProbs.csv', Y_prob, delimiter=',')
