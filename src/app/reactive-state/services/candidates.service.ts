import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, Observable, switchMap, take, tap} from "rxjs";
import {Candidate} from "../models/candidate.model";
import {environment} from "../../../environments/environment.development";

@Injectable()
export class CandidatesService {

  constructor(private http: HttpClient) {}

  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _candidates$: BehaviorSubject<Candidate[]> = new BehaviorSubject<Candidate[]>([]);
  private lastCandidatesLoad = 0;

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  private setLoadingStatus(loading: boolean): void {
    this._loading$.next(loading);
  }

  getCandidatesFromServer() {
    if (Date.now() - this.lastCandidatesLoad < 300000)
      return;

    this.setLoadingStatus(true);
    this.http.get<Candidate[]>(`${environment.urlApi}/candidates`).pipe(
      delay(1000),
      tap(candidates => {
        this.lastCandidatesLoad = Date.now();
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getCandidateById(candidateId: number): Observable<Candidate> {
    if (!this.lastCandidatesLoad)
      this.getCandidatesFromServer();

    return this._candidates$.pipe(
      map(candidates => candidates.filter(candidate => candidate.id === candidateId)[0])
    );
  }

  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.urlApi}/candidates/${id}`).pipe(
      delay(1000),
      switchMap(() => this.candidates$),
      take(1),
      map(candidates => candidates.filter(candidate => candidate.id !== id)),
      tap(candidates => {
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  hireCandidate(id: number): void {
    this.candidates$.pipe(
      take(1),
      map(candidates => candidates
        .map(
        candidate => candidate.id === id ?
          { ...candidate, company: 'Snapface Ltd'} :
          candidate
        )
      ),
      tap(updateCandidates => this._candidates$.next(updateCandidates)),
      delay(1000),
      switchMap(updateCandidates =>
            this.http.patch(`${environment.urlApi}/candidates/${id}`,
              updateCandidates.find(candidate => candidate.id === id))
      )
    ).subscribe();
  }
}
