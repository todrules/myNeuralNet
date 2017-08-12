import * as mathjs from 'mathjs';
import Matrix = mathjs.Matrix;
import { Goal } from '../motivation/goal';
import { Food } from '../entities/food';
import { Entity } from '../network/models';

export interface Experience {
  inputs?: any;
  isNewExperience?: boolean;
  relatedGoals?: Goal | Goal[];
  confidence?: number;
  exertion?: number;
  influence?: number;
  expertise?: number;
  stressFactor?: number;
  expectedReward?: any;
  primaryEntity?: Entity;
  otherEntities?: Entity[];
  uiState?: UIState;
  
}

export interface PastEperience extends Experience {
  pastRewards?: any;
  lastRewardAmount?: number;
  wasExpectedReward?: boolean;
  wasSuccessful?: boolean;
  didBlockGoal?: boolean;
  relatedEmotions?: any;
}

export interface UIState {
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  avatarLoc?: number[];
  partialEnv?: PartialEnvObj[];
  numCycles?: number;
  timeSinceLastReward?: number;
  
}

export interface PartialEnvObj {
  food?: Food;
  dist?: number;
  index?: number;
  visibleArea?: {
    topLeft?: number[];
    topRight?: number[];
    bottomLeft?: number[];
    bottomRight?: number[];
  }
}


export interface Document {
  type?: DocumentType;
  content?: string;
  gcsContentUri?: string;
  language?: string;
}

export enum DocumentType {
  TYPE_UNSPECIFIED,
  PLAIN_TEXT,
  HTML
}

export interface Sentence {
  text?: TextSpan;
  sentiment?: Sentiment;
}

export interface Entity {
  name?: string;
  type?: EntityType;
  metadata?: any;
  salience?: number;
  mentions?: EntityMention | EntityMention[];
  sentiment?: Sentiment;
  
}

export interface EntityType {
  UNKNOWN,
  PERSON,
  LOCATION,
  ORGANIZATION,
  EVENT,
  WORK_OF_ART,
  CONSUMER_GOOD,
  OTHER
}

export interface Token {
  text?: TextSpan;
  partOfSpeech?: PartOfSpeech;
  dependencyEdge?: DependencyEdge;
  lemma?: string;
  
}

export interface Sentiment {
  magnitude?: number;
  score?: number;
  
}

export interface PartOfSpeech {
  tag: Tag;
  aspect: Aspect;
  case: Case;
  form: Form;
  gender: Gender;
  mood: Mood;
  number: Number;
  person: Person;
  proper: Proper;
  reciprocity: Reciprocity;
  tense: Tense;
  voice: Voice;
  
}

export enum Tag {
  UNKNOWN,
  ADJ,
  ADP,
  ADV,
  CONJ,
  DET,
  NOUN,
  NUM,
  PRON,
  PRT,
  PUNCT,
  VERB,
  X,
  AFFIX
  
}

export enum Aspect {
  ASPECT_UNKNOWN,
  PERFECTIVE,
  IMPERFECTIVE,
  PROGRESSIVE
}

export enum Case {
  CASE_UNKNOWN,
  ACCUSATIVE,
  ADVERBIAL,
  COMPLEMENTIVE,
  DATIVE,
  GENITIVE,
  INSTRUMENTAL,
  LOCATIVE,
  NOMINATIVE,
  OBLIQUE,
  PARTITIVE,
  PREPOSITIONAL,
  REFLEXIVE_CASE,
  RELATIVE_CASE,
  VOCATIVE
}

export enum Form {
  FORM_UNKNOWN,
  ADNOMIAL,
  AUXILIARY,
  COMPLEMENTIZER,
  FINAL_ENDING,
  GERUND,
  REALIS,
  IRREALIS,
  SHORT,
  LONG,
  ORDER,
  SPECIFIC
}

export enum Gender {
  GENDER_UNKNOWN,
  FEMININE,
  MASCULINE,
  NEUTER
}

export enum Mood {
  MOOD_UNKNOWN,
  CONDITIONAL_MOOD,
  IMPERATIVE,
  INDICATIVE,
  INTERROGATIVE,
  JUSSIVE,
  SUBJUNCTIVE
}

export enum Number {
  NUMBER_UNKNOWN,
  SINGULAR,
  PLURAL,
  DUAL
}

export enum Person {
  PERSON_UNKNOWN,
  FIRST,
  SECOND,
  THIRD,
  REFLEXIVE_PERSON
}

export enum Proper {
  PROPER_UNKNOWN,
  PROPER,
  NOT_PROPER
}

export enum Reciprocity {
  RECIPROCITY_UNKNOWN,
  NON_RECIPROCAL
}

export enum Tense {
  TENSE_UNKNOWN,
  CONDITIONAL_TENSE,
  FUTURE,
  PAST,
  PRESENT,
  IMPERFECT,
  PLUPERFECT
}

export enum Voice {
  VOICE_UNKNOWN,
  ACTIVE,
  CAUSATIVE,
  PASSIVE
}

export interface DependencyEdge {
  headTokenIndex?: number;
  label: Label;
}

export enum Label {
  UNKNOWN,
  ABBREV,
  ACOMP,
  ADVCL,
  ADVMOD,
  AMOD,
  APPOS,
  ATTR,
  AUX,
  AUXPASS,
  CC,
  CCOMP,
  CONJ,
  CSUBJ,
  CSUBJPASS,
  DEP,
  DET,
  DISCOURSE,
  DOBJ,
  EXPL,
  GOESWITH,
  IOBJ,
  MARK,
  MWE,
  MWV,
  NEG,
  NN,
  NPADVMOD,
  NSUBJ,
  NSUBJPASS,
  NUM,
  NUMBER,
  P,
  PARATAXIS,
  PARTMOD,
  PCOMP,
  POBJ,
  POSS,
  POSTNEG,
  PRECOMP,
  PRECONJ,
  PREDET,
  PREF,
  PREP,
  PRONL,
  PRT,
  PS,
  QUANTMOD,
  RCMOD,
  RCMODREL,
  RDROP,
  REF,
  REMNANT,
  REPARANDUM,
  ROOT,
  SNUM,
  SUFF,
  TMOD,
  TOPIC,
  VMOD,
  VOCATIVE,
  XCOMP,
  SUFFIX,
  TITLE,
  ADVPHMOD,
  AUXCAUS,
  AUXVV,
  DTMOD,
  FOREIGN,
  KW,
  LIST,
  NOMC,
  NOMCSUBJ,
  NOMCSUBJPASS,
  NUMC,
  COP,
  DISLOCATED
}

export interface EntityMention {
  text?: TextSpan;
  type?: MentionType;
  sentiment?: Sentiment;
  
}

export enum MentionType {
  TYPE_UNKNOWN,
  PROPER,
  COMMON
}

export interface TextSpan {
  content?: string;
  beginOffset?: number;
  
}

export interface AnalyzeSentimentRequest {
  document?: Document;
  encodingType?: EncodingType;
  
}

export interface AnalyzeSentimentResponse {
  documentSentiment?: Sentiment;
  language?: string;
  sentences?: Sentence | Sentence[];
  
}

export interface AnalyzeEntitySentimentRequest {
  document?: Document;
  encodingType?: EncodingType;
}

export interface AnalyzeSentimentResponse {
  entities?: Entity | Entity[];
  language?: string;
  
}

export interface AnalyzeEntitiesRequest {
  document?: Document;
  encodingType?: EncodingType;
}

export interface AnalyzeEntitiesResponse {
  entities?: Entity | Entity[];
  language?: string;
  
}

export interface AnalyzeSyntaxRequest {
  document?: Document;
  encodingType?: EncodingType;
}

export interface AnalyzeSyntaxResponse {
  sentences?: Sentence | Sentence[];
  language?: string;
  tokens?: Token | Token[];
  
}

export interface AnnotateTextRequest {
  document?: Document;
  features: Features;
  encodingType?: EncodingType;
}

export interface Features {
  extractSyntax?: boolean;
  extractEntities?: boolean;
  extractDocumentSentiment?: boolean;
  extractEntitySentiment?: boolean;
}

export interface AnnotateTextResponse {
  sentences?: Sentence | Sentence[];
  tokens?: Token | Token[];
  entities?: Entity | Entity[];
  documentSentiment?: Sentiment;
  language?: string;
}

export enum EncodingType {
  NONE,
  UTF8,
  UTF16,
  UTF32
}
